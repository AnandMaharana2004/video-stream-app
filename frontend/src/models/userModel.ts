"use server";
import bcrypt from 'bcryptjs';
import { model, models, Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    username: string;
    password?: string;
    google_id?: string;
    email: string;
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
    },
    {
        timestamps: true,
    }
);


userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password || '');
};

export const User = models?.VideoTransCodeUser || model<IUser>('VideoTransCodeUser', userSchema);