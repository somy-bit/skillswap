export async function deleteZoomMeeting(meetingId: string) {
  const zoomToken = getZoomAccessToken();
  const res = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${zoomToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete Zoom meeting: ${res.statusText}`);
  }
}

async function getZoomAccessToken() {
  const res = await fetch("https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + process.env.ZOOM_ACCOUNT_ID, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString("base64")
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to get Zoom token: ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}
