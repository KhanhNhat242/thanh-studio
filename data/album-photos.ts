// Tự sinh từ kho ảnh public/images/library — mỗi album là một bộ ảnh của một cặp đôi.
import type { StaticImageData } from "next/image";

import aoDaiDoLangTam01 from "@/public/images/albums/ao-dai-do-lang-tam/ao-dai-do-lang-tam-01.jpg";
import aoDaiDoLangTam02 from "@/public/images/albums/ao-dai-do-lang-tam/ao-dai-do-lang-tam-02.jpg";
import aoDaiDoLangTam03 from "@/public/images/albums/ao-dai-do-lang-tam/ao-dai-do-lang-tam-03.jpg";
import aoDaiDoLangTam04 from "@/public/images/albums/ao-dai-do-lang-tam/ao-dai-do-lang-tam-04.jpg";
import aoDaiDoLangTam05 from "@/public/images/albums/ao-dai-do-lang-tam/ao-dai-do-lang-tam-05.jpg";
import songHuongKhachSanCoDien01 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-01.jpg";
import songHuongKhachSanCoDien02 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-02.jpg";
import songHuongKhachSanCoDien03 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-03.jpg";
import songHuongKhachSanCoDien04 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-04.jpg";
import songHuongKhachSanCoDien05 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-05.jpg";
import songHuongKhachSanCoDien06 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-06.jpg";
import songHuongKhachSanCoDien07 from "@/public/images/albums/song-huong-khach-san-co-dien/song-huong-khach-san-co-dien-07.jpg";
import studioTrangTinhKhoi01 from "@/public/images/albums/studio-trang-tinh-khoi/studio-trang-tinh-khoi-01.jpg";
import studioTrangTinhKhoi02 from "@/public/images/albums/studio-trang-tinh-khoi/studio-trang-tinh-khoi-02.jpg";
import studioTrangTinhKhoi03 from "@/public/images/albums/studio-trang-tinh-khoi/studio-trang-tinh-khoi-03.jpg";
import studioTrangTinhKhoi04 from "@/public/images/albums/studio-trang-tinh-khoi/studio-trang-tinh-khoi-04.jpg";
import cungDienVangSon01 from "@/public/images/albums/cung-dien-vang-son/cung-dien-vang-son-01.jpg";
import cungDienVangSon02 from "@/public/images/albums/cung-dien-vang-son/cung-dien-vang-son-02.jpg";
import cungDienVangSon03 from "@/public/images/albums/cung-dien-vang-son/cung-dien-vang-son-03.jpg";
import cungDienVangSon04 from "@/public/images/albums/cung-dien-vang-son/cung-dien-vang-son-04.jpg";
import cungDienVangSon05 from "@/public/images/albums/cung-dien-vang-son/cung-dien-vang-son-05.jpg";
import doiThongTrongGio01 from "@/public/images/albums/doi-thong-trong-gio/doi-thong-trong-gio-01.jpg";
import doiThongTrongGio02 from "@/public/images/albums/doi-thong-trong-gio/doi-thong-trong-gio-02.jpg";
import doiThongTrongGio03 from "@/public/images/albums/doi-thong-trong-gio/doi-thong-trong-gio-03.jpg";
import doiThongTrongGio04 from "@/public/images/albums/doi-thong-trong-gio/doi-thong-trong-gio-04.jpg";
import doiThongTrongGio05 from "@/public/images/albums/doi-thong-trong-gio/doi-thong-trong-gio-05.jpg";
import binhMinhTrenBien01 from "@/public/images/albums/binh-minh-tren-bien/binh-minh-tren-bien-01.jpg";
import binhMinhTrenBien02 from "@/public/images/albums/binh-minh-tren-bien/binh-minh-tren-bien-02.jpg";
import binhMinhTrenBien03 from "@/public/images/albums/binh-minh-tren-bien/binh-minh-tren-bien-03.jpg";
import binhMinhTrenBien04 from "@/public/images/albums/binh-minh-tren-bien/binh-minh-tren-bien-04.jpg";
import luaDoGiuaRung01 from "@/public/images/albums/lua-do-giua-rung/lua-do-giua-rung-01.jpg";
import luaDoGiuaRung02 from "@/public/images/albums/lua-do-giua-rung/lua-do-giua-rung-02.jpg";
import luaDoGiuaRung03 from "@/public/images/albums/lua-do-giua-rung/lua-do-giua-rung-03.jpg";
import luaDoGiuaRung04 from "@/public/images/albums/lua-do-giua-rung/lua-do-giua-rung-04.jpg";
import luaDoGiuaRung05 from "@/public/images/albums/lua-do-giua-rung/lua-do-giua-rung-05.jpg";
import nangRungNhietDoi01 from "@/public/images/albums/nang-rung-nhiet-doi/nang-rung-nhiet-doi-01.jpg";
import nangRungNhietDoi02 from "@/public/images/albums/nang-rung-nhiet-doi/nang-rung-nhiet-doi-02.jpg";
import nangRungNhietDoi03 from "@/public/images/albums/nang-rung-nhiet-doi/nang-rung-nhiet-doi-03.jpg";
import nangRungNhietDoi04 from "@/public/images/albums/nang-rung-nhiet-doi/nang-rung-nhiet-doi-04.jpg";
import mayNuiLangCo01 from "@/public/images/albums/may-nui-lang-co/may-nui-lang-co-01.jpg";
import mayNuiLangCo02 from "@/public/images/albums/may-nui-lang-co/may-nui-lang-co-02.jpg";
import mayNuiLangCo03 from "@/public/images/albums/may-nui-lang-co/may-nui-lang-co-03.jpg";
import mayNuiLangCo04 from "@/public/images/albums/may-nui-lang-co/may-nui-lang-co-04.jpg";

export const albumPhotos = {
  "ao-dai-do-lang-tam": [aoDaiDoLangTam01, aoDaiDoLangTam02, aoDaiDoLangTam03, aoDaiDoLangTam04, aoDaiDoLangTam05],
  "song-huong-khach-san-co-dien": [songHuongKhachSanCoDien01, songHuongKhachSanCoDien02, songHuongKhachSanCoDien03, songHuongKhachSanCoDien04, songHuongKhachSanCoDien05, songHuongKhachSanCoDien06, songHuongKhachSanCoDien07],
  "studio-trang-tinh-khoi": [studioTrangTinhKhoi01, studioTrangTinhKhoi02, studioTrangTinhKhoi03, studioTrangTinhKhoi04],
  "cung-dien-vang-son": [cungDienVangSon01, cungDienVangSon02, cungDienVangSon03, cungDienVangSon04, cungDienVangSon05],
  "doi-thong-trong-gio": [doiThongTrongGio01, doiThongTrongGio02, doiThongTrongGio03, doiThongTrongGio04, doiThongTrongGio05],
  "binh-minh-tren-bien": [binhMinhTrenBien01, binhMinhTrenBien02, binhMinhTrenBien03, binhMinhTrenBien04],
  "lua-do-giua-rung": [luaDoGiuaRung01, luaDoGiuaRung02, luaDoGiuaRung03, luaDoGiuaRung04, luaDoGiuaRung05],
  "nang-rung-nhiet-doi": [nangRungNhietDoi01, nangRungNhietDoi02, nangRungNhietDoi03, nangRungNhietDoi04],
  "may-nui-lang-co": [mayNuiLangCo01, mayNuiLangCo02, mayNuiLangCo03, mayNuiLangCo04],
} satisfies Record<string, StaticImageData[]>;
