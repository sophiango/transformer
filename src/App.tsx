import './App.css'
import SideMenu from './SideMenu'
import VideoView from './VideoView'
import Waveform from "./Waveform.tsx";

function App() {
    return (
        <>
            <div className="flex mb-4 full-width">
                <div className="w-1/6">
                    <SideMenu/>
                </div>
                <div className="w-5/6">
                    <VideoView/>
                    <Waveform/>
                </div>
            </div>
        </>
    )
}

export default App
