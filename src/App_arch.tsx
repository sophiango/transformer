import './App_arch.css'
import SideMenu from './SideMenu'
import VideoView from './components/VideoView.tsx'
import Waveform from "./components/Waveform.tsx";

function App_arch() {
    return (
        <>
            <div className="flex mb-4 full-width">
                <div className="w-1/6">
                    <SideMenu/>
                </div>
                <div className="w-5/6 relative z-0">
                    <VideoView/>
                    <Waveform/>
                    {/*<div className="absolute inset-0 flex justify-center items-center z-10">*/}
                    {/*    <Alert/>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}

export default App_arch
