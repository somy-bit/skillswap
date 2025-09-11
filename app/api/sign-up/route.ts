
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminBucket, adminDb } from "@/lib/firebaseAdmin";


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File | null;
        const profileDataString = formData.get("profileData") as string;
        console.log('signup', profileDataString)
        const profileData = JSON.parse(profileDataString)
        const { email, password, name } = profileData;

        if (!email || !password || !name || !profileData) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }


        const userRecord = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

       
        let imageUrl: string | null = null;
        if (image) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const file = adminBucket.file(`avatars/${userRecord.uid}/${image.name}`);
            await file.save(buffer, { contentType: image.type });
            const signedUrls = await file.getSignedUrl({
                action: 'read',
                expires: '03-17-2040', // or a specific expiration date
            });
            imageUrl = signedUrls[0];
        }
        const profile = { ...profileData, avatar: imageUrl };
        await adminDb.collection("profiles").doc(userRecord.uid).set(profile, { merge: true });


        return NextResponse.json({ message: "User created" }, { status: 201 });

    }
    catch (error) {
        console.error("Error during sign-up:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
