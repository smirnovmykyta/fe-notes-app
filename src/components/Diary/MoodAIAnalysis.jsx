import {useRef, useState} from 'react';
import { Charts } from '@/components/Diary';
import {chat} from "@/api/proxyAIAPI.js";
import {getMessageForDiaryAnalyze} from "@/helpers/getMessageForDiaryAnalyze.js";

const MoodAIAnalysis = ({ entries }) => {
  const modalRef = useRef();
  const [analysis, setAnalysis] = useState({});

  const handleAISummary = async () => {
    try {
      const response = await chat(getMessageForDiaryAnalyze(entries));
      const content = response.text.replace(/```json/g, "").replace(/```/g, "");
      setAnalysis(JSON.parse(content))
      console.log(JSON.parse(content))
      console.log(analysis.entries
      )
    }catch (error){
      console.error(error)
    }
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex items-center gap-3'>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {analysis.overall_sentiment ? analysis.overall_sentiment : "AI SUMMARY GOES HERE..."}
            </div>
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>
              {analysis.entries ? <Charts aiSummary={analysis.entries} /> : "AI CHART GOES HERE..."}
            </div>
          </div>
          <div className='flex justify-center'>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
            >
              Gen AI mood analysis ✨
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
