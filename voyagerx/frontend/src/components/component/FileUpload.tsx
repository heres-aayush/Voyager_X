"use client";
import { useState, useEffect } from "react";

interface UploadRecord {
  cid: string;
  fileName: string;
  timestamp: string;
}

export default function LockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadRecord[]>([]);

  useEffect(() => {
    // Load upload history from localStorage on component mount
    const savedHistory = localStorage.getItem('uploadHistory');
    if (savedHistory) {
      setUploadHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (newCid: string, fileName: string) => {
    const newRecord: UploadRecord = {
      cid: newCid,
      fileName: fileName,
      timestamp: new Date().toLocaleString()
    };
    
    const updatedHistory = [newRecord, ...uploadHistory];
    setUploadHistory(updatedHistory);
    localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCid(data.cid);
        addToHistory(data.cid, file.name);
        setError(null);
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch (err) {
      setError("An error occurred while uploading.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Upload Section */}
        <div className="flex-1 bg-zinc-800/30 p-8 rounded-2xl shadow-2xl border border-zinc-700/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Upload Document to IPFS
            <span className="block text-sm font-normal text-zinc-400 mt-1">
              Secure your files on the decentralized network
            </span>
          </h2>
          
          <div className="mt-8 space-y-6">
            <div className="relative group">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="w-full text-sm text-zinc-300 file:mr-4 file:py-3 file:px-6 
                  file:rounded-xl file:border-0 file:text-sm file:font-medium
                  file:bg-rose-500 file:text-white hover:file:bg-rose-600 
                  file:transition-all file:duration-200 file:cursor-pointer
                  cursor-pointer truncate bg-zinc-700/30 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <button 
              onClick={uploadFile} 
              className="w-full bg-rose-500 text-white px-6 py-3.5 rounded-xl
                hover:bg-rose-600 active:bg-rose-700
                transition-all duration-200 font-medium
                shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20
                focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              Upload to IPFS
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="md:w-[400px] bg-zinc-800/30 p-8 rounded-2xl shadow-2xl border border-zinc-700/30 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2 text-white">
            Upload History
            <span className="block text-sm font-normal text-zinc-400 mt-1">
              Your previous uploads
            </span>
          </h2>

          <div className="mt-8 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            {uploadHistory.map((record, index) => (
              <div 
                key={index} 
                className="p-4 bg-zinc-700/30 rounded-xl border border-zinc-600/30 
                  hover:border-rose-500/20 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-zinc-300 truncate flex-1">{record.fileName}</p>
                </div>
                
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${record.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:text-rose-300 transition-colors text-sm 
                    flex items-center gap-2 group mb-2"
                >
                  <span className="truncate">{record.cid}</span>
                  <svg className="w-4 h-4 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <p className="text-xs text-zinc-500">{record.timestamp}</p>
              </div>
            ))}
            {uploadHistory.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-zinc-500">No uploads yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS to your global styles or component
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(39, 39, 42, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(244, 63, 94, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(244, 63, 94, 0.5);
  }
`;
