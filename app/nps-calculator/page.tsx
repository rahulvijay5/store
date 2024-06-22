'use client'

import React, { useState } from "react";
// import ContentContainer from "../ContentContainer";
// import Content from "./Content";

const NPSCalculator: React.FC = () => {
  const initialState = {
    responses: [] as number[],
  };

  const [state, setState] = useState(initialState);

  const calculateNPS = () => {
    const totalResponses = state.responses.length;
    const detractorsCount = state.responses.filter((r) => r >= 0 && r <= 6).length;
    const promotersCount = state.responses.filter((r) => r >= 9 && r <= 10).length;

    const nps =
      totalResponses > 0
        ? ((promotersCount - detractorsCount) / totalResponses) * 100
        : 0;

    return nps.toFixed(0);
  };

  const handleButtonClick = (value: number) => {
    setState((prevState) => ({
      responses: [...prevState.responses, value],
    }));
  };

  const resetSelections = () => {
    setState(initialState);
  };

  return (
    <div style={{ backgroundColor: "#fbf9ff" }}>
        
      {/* <ContentContainer> */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-purple-600">No signup required</h1>
        <h2 className="text-4xl font-bold">NPS Calculator</h2>
        <p className="text-lg text-gray-500">
          Use this NPS Calculator to gauge customer satisfaction levels accurately.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl rounded-lg bg-white p-10 shadow-md">
          <h3 className="mb-4 text-center text-2xl font-bold text-[#7F56D9]">
            Find your Net Promoter Score for free
          </h3>
          <div className="mb-5 flex justify-center gap-4">
            <div>
              <label className="mb-2 block text-gray-700">Detractors</label>
              <div className="flex space-x-1 rounded-lg bg-pink-500 p-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index}>
                    <p className="text-center text-white">{index}</p>
                    <button
                      className="h-8 w-8 rounded shadow-lg bg-white hover:bg-gray-200"
                      onClick={() => handleButtonClick(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-gray-700">Passives</label>
              <div className="flex space-x-1 rounded-lg bg-purple-500 p-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index + 7}>
                    <p className="text-center text-white">{index + 7}</p>
                    <button
                      className="h-8 w-8 rounded shadow-lg bg-white hover:bg-gray-200"
                      onClick={() => handleButtonClick(index + 7)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-gray-700">Promoters</label>
              <div className="flex space-x-1 rounded-lg bg-green-500 p-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index + 9}>
                    <p className="text-center text-white">{index + 9}</p>
                    <button
                      className="h-8 w-8 rounded shadow-lg bg-white hover:bg-gray-200"
                      onClick={() => handleButtonClick(index + 9)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="my-2 flex flex-col w-full max-w-md items-center justify-between">
              <label className="block text-gray-700">Your Score</label>
              <div className="mt-6 text-4xl font-bold text-green-500">
                {calculateNPS()} NPS
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <button
              className="mb-4 w-1/2 rounded-lg bg-[#7F56D9] p-2 text-white sm:w-1/3"
              onClick={resetSelections}
            >
              Reset
            </button>
          </div>
          <label className="mb-2 block text-xs text-gray-500">
            Net Promoter Score and NPS are registered trademarks of Bain &
            Company, Inc., Fred Reichheld and Satmetrix Systems, Inc
          </label>
        </div>
      </div>
      {/* </ContentContainer>
      <Content/> */}
    </div>
  );
};

export default NPSCalculator;
