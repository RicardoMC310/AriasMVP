import { Router } from "express"

export type HttpController = {
    router: Router,
    prefix: string
};