import Link from "next/link";

const AppTitle = () => {

    const titleClickHandler = () => {
        window.scrollTo(0, 0);
    }
    return (
        <Link href="/" className="header-title-container" onClick={titleClickHandler}>
            <span className="header-title-stream">Stream</span>
            <span className="header-title-storm">Storm</span>
        </Link>
    )
}

export default AppTitle;