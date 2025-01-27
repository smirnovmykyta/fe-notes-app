import { useRef, useState } from 'react';
import {chat, streamChat} from "@/api/proxyAIAPI.js";
import {getMessageForNotesAnalyze} from "@/helpers/getMessageForNotesAnalyze.js";

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const [analysis, setAnalysis] = useState("");
  const [stream, setStream] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAISummary = async () => {
    setIsLoading(true);
    setAnalysis("");

    if (stream) {
      setIsLoading(false);
      try {
        await streamChat(getMessageForNotesAnalyze(notes), (partialResponse) => {
          setAnalysis((prev) => prev + partialResponse);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await chat(getMessageForNotesAnalyze(notes));
        setAnalysis(response.text)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false);
      }
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
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Gen summary</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => setStream(p => !p)}
              />
            </label>

            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div
              className='textarea textarea-success w-full h-[400px] overflow-y-scroll'
            >
              {isLoading
                  ? "Loading..."
                  : analysis || "AI SUMMARY GOES HERE..."}
            </div>
            <button
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'
              onClick={handleAISummary}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Gen AI summary ✨"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
