// config/imagekit.js
import ImageKit from "imagekit"

const imageKit=new ImageKit({
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT // ✅ correct property name is urlEndpoint
});


export default imageKit;
