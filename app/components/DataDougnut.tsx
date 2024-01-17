"use client";
import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import formatTimeLeft from "./Utils/formatTimeLeft";
import { getPotValue } from "@/context/functions/getPotValue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useStore } from "@/store/store";
import { useShallow } from "zustand/react/shallow";

export default function DataDougnut() {
  //donut chart elements
  ChartJS.register(ArcElement, Tooltip, Legend);

  const {
    setActiveNft,
    timeLeft,
    firebaseJackpotNfts,
    tabs,
    potValue,
    setPotValue,
  } = useStore(
    useShallow((store) => ({
      setActiveNft: store.setActiveNft,
      timeLeft: store.timeLeft,
      firebaseJackpotNfts: store.firebaseJackpotNfts,
      tabs: store.tabs,
      potValue: store.potValue,
      setPotValue: store.setPotValue,
    }))
  );

  useEffect(() => {
    async function fetchPotValue() {
      const potValue = await getPotValue();
      setPotValue(potValue.matic);
    }
    fetchPotValue();
  }, []);

  const chartData = [
    { owner: "owner1", percentage: 13, totalValue: 500 },
    { owner: "owner2", percentage: 13, totalValue: 100 },
    { owner: "owner3", percentage: 14, totalValue: 300 },
    { owner: "owner4", percentage: 17, totalValue: 200 },
    { owner: "owner5", percentage: 23, totalValue: 900 },
  ]; //placeholder data

  const itemValues = chartData.map((data) => data.percentage.toFixed(0));
  const itemLabels = chartData.map(
    (data) =>
      `${data.owner.slice(0, 6)}...: ${data.totalValue.toFixed(2)} MATIC`
  );
  const data2 = {
    labels: itemLabels,
    datasets: [
      {
        label: "% chance to win ",
        data: itemValues,
        backgroundColor: [
          "rgba(217, 119, 6, 0.3)", // amber
          "rgba(255, 0, 255, 0.3)", // mag
          "rgba(217, 119, 6, 0.6)", // amber
          "rgba(255, 0, 255, 0.6)", // mag
          "rgba(217, 119, 6, 0.9)", // amber
          "rgba(255, 0, 255, 0.9)", // mag
        ],
        borderColor: [
          "rgba(217, 119, 6, 0.3)", // gray
        ],
        borderWidth: 3,
      },
    ],
  };
  const handleChartClick = (_event: any, elements: string | any[]) => {
    if (elements.length > 0 && tabs[2].current) {
      const index = elements[0].index;
      const activeNft = firebaseJackpotNfts[index];
      setActiveNft(activeNft);
    }
  };
  const handleChartUpdate = async (chart: any) => {
    const newPotValue = await getPotValue();
    setPotValue(newPotValue.matic);
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw: function (chart: any, args: any, pluginOptions: any) {
      const { ctx } = chart;
      ctx.save();
      ctx.font = "bolder 40px sans-serif";
      ctx.fillStyle = "rgb(168, 162, 158, .7)"; // Custom color using RGB format
      ctx.fillText(
        `${pluginOptions.potValue.toFixed(2)} MATIC`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
      ctx.fillText(
        `${pluginOptions.potTimer}`,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y + 70 // add the height of the first line of text
      );
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
    },
  };

  const options = {
    //for donut chart
    responsive: true,
    onClick: handleChartClick,
    plugins: {
      legend: {
        display: false,
        position: "top",
        align: "start",
      },
      textCenter: {
        ...textCenter,
        potValue: potValue,
        potTimer: formatTimeLeft(timeLeft as number),
      },
    },
    animation: {
      onComplete: handleChartUpdate, // call handleChartUpdate when the chart is updated
    },
  };
  return (
    <Doughnut
      data={data2}
      plugins={[textCenter]}
      //@ts-ignore
      options={options}
    />
  );
}
