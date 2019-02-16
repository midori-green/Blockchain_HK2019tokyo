/**
  * A collection of function related with blob(Binary Large OBject).
  * @version 1.0
  * @license MIT ( http://opensource.org/licenses/MIT )
  * @author jiyu ( https://github.com/jiyu3 )
  */
export class BlobModule {
	/**
	 * Create Blob Object from string.
	 * @param  object content / download file's row data
	 * @return string / blob url like: blob:http://example.com/97ee1f1f-b021-48fa-93c5-4dae85
	 */
  createBlobURL(content) {
    return window.URL.createObjectURL(new Blob([content]));
  }

	/**
	 * Create DOM element.
	 * @param  object content / download file's row data
	 * @return string / blob url like: blob:http://example.com/97ee1f1f-b021-48fa-93c5-4dae85
	 */
  createElement(tag_name, ...args) {
    if (tag_name === null || args.length % 2 !== 0)
      return false;

    let element = document.createElement(tag_name);
    for (let i = 1; i < arguments.length; i + 2)
      element.setAttribute(args[i], args[i + 1]);

    return element;
  }

	/**
	 * Create <a> element.
	 * @param  object content / download file's row data
	 * @return string / blob url like: blob:http://example.com/97ee1f1f-b021-48fa-93c5-4dae85
	 */
  createElementImg(src, ...args) {
    return this.createElement.bind("img", "src", src)(args);
  }

	/**
	 * Create <audio> element.
	 * @param  object content / download file's row data
	 * @return string / blob url like: blob:http://example.com/97ee1f1f-b021-48fa-93c5-4dae85
	 */
  createElementAudio(src, ...args) {
    return this.createElement.bind("audio", "src", src)(args);
  }

	/**
	 * Create <video> element.
	 * @param  object content / download file's row data
	 * @return string / blob url like: blob:http://example.com/97ee1f1f-b021-48fa-93c5-4dae85
	 */
  createElementVideo(src, ...args) {
    return this.createElement.bind("video", "src", src)(args);
  }

	/**
	 * Download data located on blob url.
	 * @param string blob_url / blob url
	 * @param string filename / download filename
	 */
  downloadFromBlobURL(blob_url, filename = "download") {
    let a = document.createElement("a");
    a.href = blob_url;
    a.download = filename;
    a.click();
  }

	/**
	 * Download content as file.
	 * @param  object content / download file's row data
	 * @param string filename / download filename
	 */
  download(content, filename = "download") {
    this.downloadFromBlobURL(this.createBlobURL(content), filename);
  }
}
