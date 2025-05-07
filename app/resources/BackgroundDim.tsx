export default function BackgroundDim(){
    return (
        <div id={"bg_dim"} className={"fixed left-0 top-0"} style={{
            zIndex:"10",
            backgroundColor:"rgba(0,0,0,0.5)",
            width:"100vw",
            height:"100vh",
            display:"none"
        }}/>
    )
}