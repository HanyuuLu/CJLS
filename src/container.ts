import Docker from "dockerode";
import fs from "fs";
import { Stream } from "stream";
class Container {
  docker: Docker;
  contianerList: Array<Docker.Container>;
  imageName: string | undefined;
  constructor() {
    this.imageName = undefined;
    try {
      let config = JSON.parse(fs.readFileSync("config.json").toString());
      // console.log(config);
      this.imageName = config["defaultAddress"];
      console.log(`using image : [${this.imageName}]`);
    } catch {
      console.error("Miss config file!");
    }
    this.docker = new Docker();
    this.contianerList = [];
    this.docker.listImages(function(err, info: Array<any>) {
      if (err) console.log(err);
      for (var i = 0; i < info.length; ++i) {
        for (var tag in info[i]["RepoTags"]) {
          if (info[i]["RepoTags"][tag] == container.imageName) {
            console.log(`image [${container.imageName}] ready.`);
            return;
          }
        }
      }
      console.warn(`image [${container.imageName}] don't exists, pulling...`);
      container.docker.pull(container.imageName as string, function(
        err: ExceptionInformation,
        info: Stream
      ) {
        if (err) {
          throw err.toString();
        }
        console.log(info);
        console.log(`pulling image [${container.imageName}] success`);
      });
    });
  }
  run() {
    this.contianerList.push(this.docker.getContainer("4d3e6a4e7bf8"));
    // this.contianerList[0].start(function(err, data) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("aaa");
    //   console.log(data.toString());
    // });
    // this.contianerList[0].stop(function(err, data) {
    //   console.log(err);
    //   console.log(data?.toString());
    // });
    // this.docker.run(this.imageName,[],)
  }
}

export let container = new Container();
