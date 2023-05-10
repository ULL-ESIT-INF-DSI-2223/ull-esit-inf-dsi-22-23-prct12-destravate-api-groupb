import { Document } from "mongoose";

export enum Type {
    correr = "correr",
    bicicleta = "bicicleta",
}

export type Coordinates = {
    lat: number;
    long: number;
    alt: number;
};

export interface TrackDocument extends Document {
    id: number;
    name: string;
    start: Coordinates;
    end: Coordinates;
    long: number;
    grade: number; // desnivel
    users: number[];
    type: Type;
    puntuation: number;
}