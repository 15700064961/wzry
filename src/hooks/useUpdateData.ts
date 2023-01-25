import switchStore from "@/store/switch";
import {
  HeroBasic,
  HeroImg,
  Herodata,
  Skill,
  Skilltype,
  Skilleffect,
  Skin,
  Skintype,
  Relationship,
  Equip,
  EquipSynthetic,
  Equiptype,
  Equipeffect,
  Epigraph,
  Epigraphtype,
  Epigrapheffect,
  Professiontype,
  Locationtype,
  Specialtytype,
  Periodtype,
  Camptype,
  RaceType,
  Voice,
} from "@/api/main/data";
import { getHeroBasic } from "@/api/main/games/hero";

export default () => {
  const $switchStore = switchStore();

  const keywords: [string, string][] = [
    ["herobasic", "英雄基础"],
    ["heroimg", "英雄图片"],
    ["herodata", "英雄信息"],
    ["skill", "技能列表"],
    ["skilltype", "技能类型"],
    ["skilleffect", "技能效果"],
    ["skin", "皮肤"],
    ["skintype", "皮肤类型"],
    ["relationship", "关系"],
    ["equip", "装备"],
    ["equipSynthetic", "装备合成"],
    ["equiptype", "装备类型"],
    ["equipeffect", "装备效果"],
    ["epigraph", "铭文"],
    ["epigraphtype", "铭文类型"],
    ["epigrapheffect", "铭文效果"],
    ["professiontype", "职业"],
    ["locationtype", "定位"],
    ["specialtytype", "特长"],
    ["periodtype", "时期"],
    ["camptype", "阵营"],
    ["racetype", "种族"],
  ];

  const requests: Record<string, () => Promise<any>> = {
    herobasic: HeroBasic,
    heroimg: HeroImg,
    herodata: Herodata,
    skill: Skill,
    skilltype: Skilltype,
    skilleffect: Skilleffect,
    skin: Skin,
    skintype: Skintype,
    relationship: Relationship,
    equip: Equip,
    equipSynthetic: EquipSynthetic,
    equiptype: Equiptype,
    equipeffect: Equipeffect,
    epigraph: Epigraph,
    epigraphtype: Epigraphtype,
    epigrapheffect: Epigrapheffect,
    professiontype: Professiontype,
    locationtype: Locationtype,
    specialtytype: Specialtytype,
    periodtype: Periodtype,
    camptype: Camptype,
    racetype: RaceType,
  };

  let hero_list: Hero.Basic[] = []; //英雄基础列表
  const need_update_data: Record<string, any[]> = {
    names: [],
    keys: [],
    data: [],
  }; //需要更新的数据
  const need_update_voice: Record<string, any[]> = {
    names: [],
    keys: [],
    data: [],
  }; //需要更新的语音

  /* 获取本地数据 */
  const getLocalData = (name: string, prefix = "data_") => {
    return JSON.parse(localStorage.getItem(prefix + name) as string);
  };

  /* 加载数据 */
  const load = async () => {
    hero_list = await getHeroBasic(); // 获取英雄基础列表

    //获取远程数据并比对
    for (const [key, name] of keywords) {
      const v = (await requests[key]()).data;
      const l = getLocalData(key);
      if (JSON.stringify(l) !== JSON.stringify(v)) {
        need_update_data.names.push(name);
        need_update_data.keys.push(key);
        need_update_data.data.push(v);
      }
    }

    // 获取远程语音并比对
    for (const hero of hero_list.filter(
      (hero) => !["梦奇", "盾山"].includes(hero.name)
    )) {
      const v = (await Voice(hero.name)).data;
      const l = getLocalData(hero.pinyin, "voice_");

      if (JSON.stringify(l) !== JSON.stringify(v)) {
        need_update_voice.names.push(hero.name);
        need_update_voice.keys.push(hero.pinyin);
        need_update_voice.data.push(v);
      }
    }

    updateData();
    updateTip();
  };

  /* 更新提示信息处理 */
  const updateTip = () => {
    const { names: data_names } = need_update_data;
    const { names: voice_names } = need_update_voice;
    const data_length = data_names.length;
    const voice_length = voice_names.length;
    let text = "";

    if (data_length || voice_length) {
      const dataToShow = data_length > 5 ? data_names.slice(0, 5) : data_names;
      const voiceToShow =
        voice_length > 5 ? voice_names.slice(0, 5) : voice_names;

      if (data_length) {
        text = `《${dataToShow.join("、")}》${
          data_length > 5 ? `...共${data_length}条数据需要更新，` : "需要更新，"
        }`;
      }

      if (voice_length) {
        text += `${data_length && "以及"}《${voiceToShow.join("、")}》${
          voice_length > 5
            ? `...共${voice_length}条语音数据需要更新，`
            : "的语音数据需要更新，"
        }`;
      }

      $switchStore.$tip({
        title: "更新提醒",
        text: `${text}已为你自动更新。如果在运行中出现数据获取失败，请尝试刷新浏览器。`,
      });
    }
  };

  /* 更新数据 */
  const updateData = () => {
    for (let i = 0; i < need_update_data.keys.length; i++) {
      const key = need_update_data.keys[i];
      localStorage.setItem(
        "data_" + key,
        JSON.stringify(need_update_data.data[i])
      );
    }

    for (let i = 0; i < need_update_voice.keys.length; i++) {
      const key = need_update_voice.keys[i];
      localStorage.setItem(
        "voice_" + key,
        JSON.stringify(need_update_voice.data[i])
      );
    }
  };

  return load();
};