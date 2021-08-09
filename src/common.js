import { Link } from "react-router-dom";

export function banner(banner_info) {
  console.log("banner_info", banner_info);

  switch (banner_info.ban_deep_link_info.schema) {
    case "content":
      if (banner_info.ban_deep_link_info.key == "cit_id")
        return (
          <Link to={"/homeiteminfo/" + banner_info.ban_deep_link_info.keyValue}>
            <img
              src={banner_info.ban_image_url}
              alt="광고배너"
              className="img"
            />
          </Link>
        );

      if (banner_info.ban_deep_link_info.key == "brd_id")
        return (
          <Link to={"/storedetail/" + banner_info.ban_deep_link_info.keyValue}>
            <img
              src={banner_info.ban_image_url}
              alt="광고배너"
              className="img"
            />
          </Link>
        );
      break;

    case "webview":
      return (
        <a
          href={
            "https://api.denguru.kr" +
            banner_info.ban_deep_link_info.path +
            "/" +
            banner_info.ban_deep_link_info.keyValue
          }
          target="_blank"
        >
          <img src={banner_info.ban_image_url} alt="광고배너" className="img" />
        </a>
      );
      break;

    case "href":
      return (
        <a
          href={
            "https://api.denguru.kr" +
            banner_info.ban_deep_link_info.path +
            "/" +
            banner_info.ban_deep_link_info.keyValue
          }
          target="_blank"
        >
          <img src={banner_info.ban_image_url} alt="광고배너" className="img" />
        </a>
      );
      break;
    default:
      return false;
  }
}

export function deepLinkToHref(deplinkinfo) {
  switch (deplinkinfo.schema) {
    case "content":
      if (deplinkinfo.key == "cit_id")
        return "/homeiteminfo/" + deplinkinfo.keyValue;

      if (deplinkinfo.key == "brd_id")
        return "/storedetail/" + deplinkinfo.keyValue;

      if (deplinkinfo.key == "post_id")
        return "/complain/" + deplinkinfo.keyValue;
      break;

    case "webview":
      return (
        "https://api.denguru.kr" + deplinkinfo.path + "/" + deplinkinfo.keyValue
      );

      break;

    case "href":
      return (
        "https://api.denguru.kr" + deplinkinfo.path + "/" + deplinkinfo.keyValue
      );
      break;
    default:
      return false;
  }
}
