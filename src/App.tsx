import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {

  const [fileText,setFileText]=useState("初期値")
  const [desMode,setDesMode]=useState(0)
  const [showProblem,setShowProblem]=useState<{ English: String; JapaneseArr: (String | String[])[]; trueAnswer: number; } | null>()

  async function fileApp(e:React.ChangeEvent<HTMLInputElement>){
    if(!e.target.files)return
  
    const file:String=await e.target.files[0].text()
  
    console.log(file)
    setFileText(String(file))
    setDesMode(1)
  }

  //問題を実行
  function op(problemSession:enjaProblem){
    setShowProblem(problemSession.makeProblem())
  }

  useEffect(()=>{
    if(desMode!=1)return

    const fileArr=fileText.split("\n").map(onePset=>onePset.split(","))

    const problemSession=new enjaProblem(fileArr)

    op(problemSession)
  },[desMode])

  return (
    <>
      <div id="select" style={{display: desMode==0 ? "block":"none" }}>
        <h1>csvファイルを選択</h1>
        <input type="file" onChange={fileApp}/>
        <p>{fileText}</p>
      </div>
      <div id="problem" style={{display: desMode==1 ? "block":"none" }}>
        <h1>問題</h1>
        <h2>{showProblem?.English}</h2>
        <div id="buttonArea">{
          showProblem?.JapaneseArr.map((oneJa)=>{
            return (
              <button>{oneJa}</button>
            )
          })
        }</div>
      </div>
      <div id="clear"></div>
    </>
  );
}

class enjaProblem{
  wrongData:String[][]
  pbData
  noData:String[][]
  constructor(pbData:String[][]){
    this.pbData=pbData//すべての問題
    this.noData=pbData//まだ答えていない問題
    this.wrongData=[]//間違えた問題
  }
  //問題を作成
  makeProblem(){
    if(this.noData.length>0){
      const problemNum=Math.floor(Math.random()*this.pbData.length)
      const problemEn=this.pbData[problemNum][0]
      const problemJa=this.pbData[problemNum][1]
      const answerArray=[]
      const answerArrayNum=Math.floor(Math.random()*4)
      //答えの配列を生成
      for(let i=0;i<4;i++){
        if(i==answerArrayNum)answerArray.push(problemJa)
        else answerArray.push(this.pbData[Math.floor(Math.random()*this.pbData.length)][1])
      }
      this.noData.splice(problemNum,1)
      return {
        English:problemEn,
        JapaneseArr:answerArray,
        trueAnswer:answerArrayNum
      }
    }
    else if(this.wrongData.length>0){
      const problemNum=Math.floor(Math.random()*this.wrongData.length)
      const problemEn=this.wrongData[problemNum][0]
      const problemJa=this.wrongData[problemNum][1]
      const answerArray=[]
      const answerArrayNum=Math.floor(Math.random()*4)
      //答えの配列を生成
      for(let i=0;i<4;i++){
        if(i==answerArrayNum)answerArray.push(problemJa)
        else answerArray.push(this.pbData[Math.floor(Math.random()*this.pbData.length)])
      }
      return {
        English:problemEn,
        JapaneseArr:answerArray,
        trueAnswer:answerArrayNum
      }
    }
    else{
      return null
    }
  }
}

export default App;
