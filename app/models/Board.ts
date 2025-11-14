import mongoose, { Document, Model, Schema } from "mongoose";
import type { RetroColumn } from "./retrospective";
export interface IEmbeddedUser {
  name: string;
  email: string;
}

const EmbeddedUserSchema = new Schema<IEmbeddedUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

const ColumnSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String, required: false },
    color: { type: String, required: false },
  },
  { _id: false }
);

const NoteSchema = new Schema(
  {
    id: { type: String, required: true },
    columnId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { _id: false }
);

export interface IBoard extends Document {
  name: string;
  retroType: string;
  columns: {
    id: string;
    label: string;
    description?: string;
    color?: string;
  }[];
  notes: {
    id: string;
    columnId: string;
    userId: string;
    content: string;
    createdAt: Date;
  }[];
  users: IEmbeddedUser[];
  admin: string,
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: { type: String },
    retroType: { type: String, required: true },
    columns: { type: [ColumnSchema], default: [], required: true },
    notes: { type: [NoteSchema], default: [] },
    users: { type: [EmbeddedUserSchema], default: [] },
    admin: { type: String, required: true }
  },
  { timestamps: true }
);

const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
export default Board;
