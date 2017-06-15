require("battle/BattleSkillManager.js")

/*
 *技能触发时机
 *1 卡牌出战时 光环技能生效 比如增加10%的攻击
 *2 卡牌出战时，计算完光环技能后，触发合击技
 *3 卡牌出战时，触发完合击技，触发出场技
 *4 卡牌出手时，大部分技能此时生效
 *5 卡牌死亡时，比如自爆，复活
 *6 卡牌释放技能A时，技能B生效，比如穿金钟罩
 *7 回合开始时，持续类技能，比如灼烧和持续回血
*/

/*
 *技能类型：
 *1，光环类技能 出战立刻生效，比如红孩儿全体加法攻
 *2，光环类技能，每回合生效，比如越战越勇,此类技能为卡牌出手完之后生效
 *3，主动释放实时结算类
 *4，主动释放持续类
 *5，依附类，比如穿金钟罩
*/

//普通攻击
//NormalAttack = BattleSkillManager.createSkill("NormalAttack")


// var s = new BattleSkillManager.skillList["stun"];
// cc.log("s ==== " + s + "  name = " + s._className)
// s.playAnimation("123");