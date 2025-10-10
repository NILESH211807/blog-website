import '../../assets/css/loader.css';

const MainLoader = () => {
    return (
        <div className='loader__container'>
            <div className='app__loader'>
                <div className="dot-spinner bg-base-100">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                </div>
            </div>
        </div>
    )
}

export default MainLoader
