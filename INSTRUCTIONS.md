# Instructions To Use The StreamStorm Application

* Download the application from the official website or repository.
   - [StreamStorm Download Page](https://streamstorm.darkglance.in)
   - [GitHub Repository](https://github.com/Ashif4344/StreamStorm)
* Install the application by following the setup wizard.
   - Double-click the downloaded installer file and follow the on-screen instructions.
* Always run the application as administrator for proper functionality.
   - Right-click on the application icon and select "Run as administrator".
   - Admin privileges are required to free up RAM.

## Requirements
* You need to have a YouTube account (Google account) to use the application.
* In your YouTube account, you need to have at least one channel created. More channels are recommended for better results.
* You need to have a web browser, either Chrome, Edge, Firefox, or Safari  installed on your system. but currently the application only supports Chrome and Edge browsers.
* Stable internet connection to function properly.
* To use one channel you need to have at least 300MB of free RAM available on your system. The more channels you use, the more RAM is required

## Using The Application

### Step 1. Create Temp Profiles

* Creating temp profiles is the first step to use the application.
    - In the application UI, click on the `Manage Profiles` button.
    - Select the Browser profile you want to create. `(Chromium, Gecko, WebKit)`
    - Enter number of profiles you want to create.
    - Click on the `Create Profiles` button.
* The application will open a browser window and it will prompt you to log in to your YouTube account
* Login to your YouTube account in the browser window that opens.
* After logging in, the application will fetch all the channels available in your YouTube account.
* After fetching the channels, the application will first close itself, and start creating the profiles.
* Each temp profile will take up to `150MB` of storage space.

The reason for creating all these profiles is that, each channel will require a separate profile to avoid any conflicts or issues with opening the browser window, since one browser window locks its own profile from being accessed by another instance of the same browser.

`There is also provision to delete all temp profiles created by the application, in case you want to start fresh.`

### Step 2. Starting The Storm

First Open the application and make sure you have created the temp profiles as mentioned in `Step 1.`

* You need to provide all the required information to start the storm.
   1. **Video URL**: Enter the URL of the YouTube video you want to storm.
       * This should be a valid youtube url copied from the url bar of your browser.
       * It should not be a playlist or channel URL.
       * Example: `https://www.youtube.com/watch?v=VIDEO_ID`
    2. **Messages**: Enter the messages you want to send in the chat.
       * You can enter multiple messages separated by a new line.
       * Example:
         ```
         Hello everyone!
         Let's support this video!
         ```
       * You can also use emojis in the messages.
       * You can enter as many messages as you like.
    3. **Subscribe switch**
       * Some channels require you to subscribe to them before you can comment on their videos.
       * If the channel you are trying to storm requires you to subscribe, then you need to enable this switch.
    4. **Subscribe and Wait Switch**
       * Some channels require you to subscribe to them and wait for a fixed time before you can comment on their videos.
       * If the channel you are trying to storm requires you to subscribe and wait, then you need to enable this switch.
    5. **Subscribe and Wait Time**
       * If you have enabled the `Subscribe and Wait` switch, then you need to enter the time in seconds you want to wait after subscribing to the channel.
       * This is the time you want to wait before starting the storm.
       * Example: `10` (for 10 seconds)
    6. **Slow mode**
       * Some channels have slow mode enabled, which means you can only send a limited number of messages in a fixed time.
       * If the channel you are trying to storm has slow mode enabled, then you need to enter the time in seconds you want to wait before sending each message.
       * Example: `5` (for 5 seconds)
    7. **Channel selection**
       * Basic
           * In basic mode you just enter the number of channels you want to use for the storm.
           * The application will automatically select the channels for you, starting from the first channel in the list, to the nth channel you provided.
       * Intermediate
           * In intermediate mode you can select a range of channels you want to use for the storm.
           for example if you have 10 channels and you want to use channels from 3 to 7, then you can give start index as 3 and end index as 7.
           * The application will select the channels from the start index to the end index you provided.
       * Advanced
            * In advanced mode you can manually select the channels you want to use for the storm.

    8. **Browser**
       * In this section, you can select the browser you want to use for the storm.
       * You can choose from the following browsers:
           * Chrome
           * Edge
       * The application will use the selected browser to open the YouTube live video and send the messages.

    9. **Load in Background**
       * If you don't want the browser ui to be visible while the storm is running, you can enable this switch.
       * This will load the browser in the background and the storm will run in the background.

       * **Note: ⚠ This feature is currently experimental and may not work as expected. We're actively working on fixing the bugs.**

    10. **Start Storm**
        * After providing all the required information, you can click on the `Start Storm` button to start the storm.
        * The application will open the browser and start sending the messages in the chat.
        * You can see the progress of the storm in the application UI.
        * You can stop the storm at any time by clicking on the `Stop Storm` button.

### Storm Controls
You can control the storm while it is running by using the following controls:
1. **Pause**
    * This will pause the storm and the application will stop sending messages in the chat.
    * The application will keep the browser open and wait for you to resume the storm.
2. **Resume**
    * This will resume the storm and the application will start sending messages in the chat again.
3. **Change Messages**
    * Sometime when the storm is running, you might want to change the messages you are sending in the chat.
    * You can click on the `Change Messages` button to change the messages.
    * This will open a dialog where you can enter the new messages you want to send in the chat.
4. **Change Slow Mode**
    * If you want to change the slow mode time while the storm is running, you can click on the `Change Slow Mode` button.
    * This will open a dialog where you can enter the new slow mode time you want to use.
5. **Don't wait**
    * Some time what happens is that when most of the channels are ready to storm and is still waiting for the remaining channels to be ready, you can click on the `Don't wait` button.
    * This will make the application to not wait for the remaining channels and start sending messages in the chat immediately.
6. **Add Channels**
    * Sometimes when the storm is running, you notice that there is more free RAM available on your system and you want to start storming with more channels, you can click on the `Add Channels` button.
    * This will open a dialog where you can select channels you want to add to the storm.
    * **Note: You need to have enough temp profiles, and enough channels on your YouTube account to add more channels to the storm.**
7. **Stop Storm**
    * If you want to stop the storm, you can click on the `Stop Storm` button.
    * This will stop the storm and the application will close all the browser instances opened by the application.

## Host Configuration
* The backend server of the application is hosted on your local machine.
* The Server is configured to run on port `1919`.

### Accessing The application from another device
We have Provisions to access the application from another device on the same network or a different network.
The another device can be a mobile phone, tablet, or another computer.
First you need to make sure that the application is running on your machine, The UI will boot up, but don't close the UI, otherwise the local server will shut down.

* **Same Network**
    * If you want to access the application from another device on the same network, you need to provide the IP address of your machine running the application.
    * You can find your IP address by running the command `ipconfig` in the command prompt or powershell. Look for the `IPv4 Address` under your active network connection. eg. `192.168.1.100`
    * Once you have your IP address, you can access the application from another device by entering the URL `http://<your-ip-address>:1919` in the browser.

* **Different Network**
    * If you want to access the application from another device on a different network, you need to configure port forwarding on your router.
    * You need to forward the port `1919` to the IP address of your machine running the application.
    * Once you have configured port forwarding, you can access the application from another device by entering the URL `http://<your-public-ip-address>:1919` in the browser.
    * You can find your public IP address by searching for "What is my IP" in Google. eg. `203.0.113.0`
    * If you didn't understand how to configure port forwarding, you can search in Google for "How to configure port forwarding" for your router model. There will be many tutorials available online.

