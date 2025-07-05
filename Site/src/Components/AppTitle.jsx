const AppTitle = () => {
    return (
        <div className="header-title-container" onClick={() => window.scrollTo(0, 0)}>
            <span className="header-title-stream">Stream</span>
            <span className="header-title-storm">Storm</span>
        </div>
    )
}

export default AppTitle;