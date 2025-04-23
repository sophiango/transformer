import './App.css'
import SideMenu from './SideMenu'
import VideoView from './VideoView'
import Waveform from "./Waveform.tsx";
import Alert from "./Alert.tsx";

function App() {
    return (
        <>
            <div className="flex mb-4 full-width">
                <div className="w-1/6">
                    <SideMenu/>
                </div>
                <div className="w-5/6 relative z-0">
                    <VideoView/>
                    <Waveform/>
                    <div className="absolute inset-0 flex justify-center items-center z-10">
                        <Alert/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
