import * as React from 'react'
import { Router, exactPath } from "./common/router";

const NgSimpleRouter = new Router();


NgSimpleRouter.use("/", exactPath(req => {
  return import("./NgSimple").then(m => {
      return <m.NgSimple host={req.app}/>;
    });
}));

export { NgSimpleRouter }

