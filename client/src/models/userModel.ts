"use server";
import bcrypt from 'bcryptjs';
import { model, models, Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    password?: string;
    google_id?: string;
    email: string;
    profilePic: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        google_id: {
            type: String,
            sparse: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        profilePic: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hasPassword = await bcrypt.hash(this.password || "", 10)
        this.password = hasPassword
    }
    next()
})
export const User = models?.VideoTransCodeUser || model<IUser>('VideoTransCodeUser', userSchema);