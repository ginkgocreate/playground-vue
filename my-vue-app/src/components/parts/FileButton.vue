<template>
    <div> 
        <LoadingView v-show="isProcessing"/>               
        <div class="row">
            <button @click="openFileDialog" :class="{btnFile:true,onSelect:fileList.length > 0}">{{value}}</button>
            <div class="caption" :class="{count:true,onSelectCount:fileList.length > 0}">(
                {{caption}}
                <button @click="clickClear" v-show="fileExists" class="btnClear">クリア</button>
            )</div>
        </div>
        <input type="file" accept="image/*" multiple @change="change" class="file" style="display:none;"/>
    </div>
</template>
<script>
import Compressor from 'compressorjs'
export default {
    props:{
        value:{
            type:String
            ,default:"Button"
        },
    }
    ,data(){
        const ret = {
            fileList:[]
            ,isProcessing:false
            ,onSelect:false
        }
        return ret
    }
    ,methods:{
        cleaerFile(){
            this.fileList = []
            this.emit(this.fileList)
        }
        ,clickClear(){
            if(confirm("ファイルをクリアします。よろしいですか？")){this.cleaerFile()}
        }
        ,openFileDialog(){
            const btn = this.$el.querySelector("input[type='file']")
            btn.click()            
        }        
        ,addFile(name,fileData){
            const obj = {name:name,data:fileData}
            this.fileList.push(obj)
        }
        ,change(e){
            
            if(!this.checkFileType(e)){
                alert("添付可能なファイルはjpg, PNGのみです");
                return false;
            }

            this.isProcessing = true
            this.cleaerFile()
            const files = e.target.files
            const promiseList = []

            //ファイル別に圧縮処理を開始            
            for(let file of files){
                const promise = this.compress(file)
                promiseList.push(promise)
            }

            //圧縮処理の完了を監視
            Promise.all(promiseList).then((fileList)=>{
                const addFile = this.addFile
                fileList.forEach(file=>addFile(file.name,file.data))         
                this.emit(this.fileList)       
                this.isProcessing = false                
            })

            //同じファイルを選んだ場合changeイベントが発生しないので空にする
            e.target.value = ''
        }
        ,checkFileType(e){
            const files = e.target.files
            const arr = ["jpeg", "jpg", "png","PNG"];
            var ret = true;
            for(let file of files){
                let type = file.name.split('.').pop(); /*拡張子を取得*/            
                if(arr.indexOf(type) == -1){
                    ret = false;
                    break;
                }
            }
            return ret;
        }
        ,compress(file){            
            const ret = new Promise(resolve=>{                
                const option = {
                    quality:0.6
                    ,success:(result)=>resolve(result)
                }
                new Compressor(file,option)
            }).then(file=>{
                const reader = new FileReader()                            
                const ret = new Promise(resolve=>{
                    reader.onload = (e) => {
                        const base64Text = e.currentTarget.result        
                        const res = {name:file.name,data:base64Text}        
                        resolve(res)
                    }
                })
                reader.readAsDataURL(file)
                return ret
            })
            return ret            
        }        
        ,emit(){
            this.$emit("selectedFilesChanged",this.fileList)
        }
    }
    ,computed:{
        caption(){
            const ret = `${this.fileList.length}ファイル選択中`
            return ret
        }
        ,fileExists(){
            return this.fileList.length > 0
        }
    }
    ,wacth:{
    }
}
</script>
<style lang="scss" scoped>
    .row{
        display: flex;
        align-items: center;
        .caption{
            font-size: 110%;
        }
    }
    .count{
        margin-left: 5px;
        color: #ccc;
    }
    .isActive{
        background-color: red;
    }

    .btnFile{
        width:100px;
        height:40px;
        background-color:#eee;
        color:#6d6d6d;
        border:solid 1px #a8a8a8;
        border-radius: 5px;
        font-size: 120%;
    }
    .onSelect{
        background-color: #ffd4b0;
    }
    .btnClear{
        width:75px;
        height:30px;
        background-color:#bbb;
        background-color:#c4c4c4;
        color:#fff;
        border-radius: 5px;
        border: none;
        font-size: 95%;
    }
    .onSelectCount{
        color: #ff9666;
    }
    .doneAttach{
        border:solid 1px orangered;
        padding:3px 5px;
        color: orangered;
        font-size: 85%;
        margin-left: 10px;
    }


</style>