

export function pushNotification(videoID: string, status: "uploading" | "processing" | "completed" | "failed") {
    /**
     * configuare teh SQS 
     * push notification 
     * {
     * videoId : "${videoID}",
     * status : "Uploading"}
     */

    console.log("push notificaton to the the SQS 🔔")
}