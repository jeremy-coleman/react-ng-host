import * as React from 'react'
import { Router, exactPath } from "./common/router";

const NgSimpleRouter = new Router();


NgSimpleRouter.use("/", exactPath(req => import("./NgSimple").then(m => <m.NgSimple host={req.app}/>)))

export { NgSimpleRouter }

