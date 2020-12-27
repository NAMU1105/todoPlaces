const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  // 업로드 된 데이터의 한도(단위: 바이트)
  limits: 500000,
  // 파일을 디스크에 저장
  storage: multer.diskStorage({
    //   파일이 저장될 위치
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },

    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  //   어떤 파일을 허용할지 제어하는 함수
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
