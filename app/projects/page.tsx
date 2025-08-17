"use client"
import React, {useEffect} from "react";
import {gebi} from "@/app/resources/gebi";
import {Background} from "@/app/resources/Background";
import BackgroundDim from "@/app/resources/BackgroundDim";
import Footer from "@/app/resources/Footer";
import Navbar from "@/app/resources/Navbar";


const summaryContainerWidth = 85;
const smallTransition = 500;
const largeTransition = 1000;
const detailsMenuWipe = 300;

/*
function SampleCat() {
    return <img
        className={"relative w-[400px]"}
        src={"https://scrumbles.co.uk/cdn/shop/articles/scottish-straight-cat-breed-guide-964256.jpg?v=1720002125"}
    />
}
 */


function scrollToElement(e: string) {
    gebi(e).scrollIntoView({behavior: "smooth", block: "center"})
}

export default function Home() {
    useEffect(() => {
    }, []);
    return (
        <>
            <Navbar customItems={null} alwaysShow={true}/>

            <Background/>
            <BackgroundDim/>


            <div id={"openerContainer"} className={"animate"}>
                <div id={"openerMain"}>
                    <div id={"messageSmall"}
                         className={"object absolute flex justify-center items-center left-[15%] w-fit px-7 py-7 top-0 opacity-0"}
                         style={{
                             top: 0, // 0 >> 15%
                             transition: `opacity ${smallTransition}ms ease-in-out, top ${smallTransition}ms ease-in-out`
                         }}>
                        <p style={{textAlign: "center"}}>Welcome to my portfolio!</p>
                    </div>
                    <div id={"messageLarge"}
                         className={"object absolute flex justify-center items-center left-[27%] w-[50%] h-[35%] text-4xl px-12 py-12 opacity-0"}
                         style={{
                             top: 0, //0 >> 40%
                             transition: `opacity ${largeTransition}ms ease-in-out, top ${largeTransition}ms ease-in-out`
                         }}>
                        <p>Michael Zhang</p>
                    </div>
                </div>
            </div>

            <div id={"summaryContainer"} className={"relative flex rounded-xl py-32 my-52"} style={{
                width: summaryContainerWidth + "vw",
                backgroundColor: "var(--theme-green)",
                left: (100 - summaryContainerWidth) / 2 + "vw",
                boxShadow: "8px 8px 0px 0px var(--theme-yellow)",
                border: "2px solid var(--theme-dark-gray)"
            }}>
                <div id={"summaryContainerLeft"} className={"w-[35%]"}>
                    <img id={"summaryImg"} src={"/resources/IMG_1399.jpg"}
                         className={"relative object-cover object-center w-[300px] h-[400px]"} style={{float: "right"}}
                         alt={"portrait photo"}/>
                </div>
                <div id={"summaryContainerRight"} className={"w-[65%] ml-5"}>
                    <div id={"summaryInfo"} className={"relative h-full flex flex-col justify-center"}>
                        <p id={"summary-title"} className={"text-4xl mb-2"}>Hi there!</p>
                        <p id={"summary-desc"} className={"w-[80%]"}>
                            I'm Michael, a rising sophomore at Northeastern University studying CS. I'm extremely
                            passionate about everything computer science, from full-stack web development to computer
                            vision and new fields like AI/Machine Learning. I'm excited to learn more and build my
                            career in the world of tech!
                        </p>
                    </div>
                </div>
            </div>

            <Footer customItems={null}/>
        </>
    );
}