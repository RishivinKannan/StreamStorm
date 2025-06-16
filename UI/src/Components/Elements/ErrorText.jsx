const ErrorText = ({ errorText }) => {
    return (
        <>
            {
                errorText && (
                    <div style={{ margin: ".5rem .5rem 0 .5rem" }}>
                        <span style={{ color: 'red', fontSize: '0.75rem' }}>
                            * {errorText}
                        </span>
                    </div>)
            }
        </>


    );
}

export default ErrorText;