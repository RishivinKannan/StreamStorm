

const submit = (
    submitUrl: string,
    video_url: string,
    chat_url: string,
    messages: string[],
    subscribe: boolean,
    subscribe_and_wait: boolean,
    subscribe_and_wait_time: number,
    slow_mode: number,
    start_account_index: number,
    end_account_index: number,
    browser: string,
    background: boolean
) => {
    const data = {
        video_url,
        chat_url,
        messages,
        subscribe,
        subscribe_and_wait,
        subscribe_and_wait_time,
        slow_mode,
        start_account_index,
        end_account_index,
        browser,
        background
    }
    
    // fetch()
}

export default submit;