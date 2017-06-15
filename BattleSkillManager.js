
SkillBase = cc.Class.extend(
{
	_className : "SkillBase",
	_skillId   : -1,
	_data      : {},
	ctor : function(data)
	{
	    this._data = data;
	    this.cast();
	},

	setSkillId : function(id)
	{
		this._skillId = id;
	},

	getSkillId : function()
	{
		return this._skillId;
	},

	cast : function()
	{

	},

});

BuffBase = cc.Class.extend(
{
	_className : "BuffBase",
	_data      : {},
	/*
	data.conf : master_skill[x].buff[i]
	data.source_index buff来源索引
	data.source_type buff来源是己方还是敌方
	data.source_attack = buff来源的攻击力
	data.begin_round = 产生buff的回合
	*/
	ctor : function(data)
	{
	    this._data = data;
	},

	//每个buff类都要重写次函数
	execute : function()
	{
		cc.log("ERROR: BuffBase execute called");
	}

	getBuffId : function()
	{
		return this._data.conf.buff_id;
	},

	getSourceIndex : function()
	{
		return this._data.source_index;
	},

	getSourceType : function()
	{
		return this._data.source_type;
	},

	getSourceAttack : function()
	{
		return this._data.source_attack;
	},

	getBeginRound : function()
	{
		return this._data.begin_round;
	},

});

/************************  BattleSkillManager  ****************************/
var BattleSkillManager = {};

//攻击类型 目前只有物理攻击和法术攻击
BattleSkillManager.ATTACK_TYPE
{
	PHY   : 1, //physical 物理攻击
	MAGIC : 2, //法术攻击
};

//当前正在施法的技能
BattleSkillManager._castSkill = null;

BattleSkillManager.createBuff = function(name)
{
    var buff = BuffBase.extend(
    {
         _className : name,
         
         ctor : function(data)
         {
            this._super(data);
         }
    });
    BattleSkillManager.buffList = BattleSkillManager.buffList || {};
    BattleSkillManager.buffList[name] =  buff;
    return buff;
}

//data: master_skill[skill_id].buff[i]
BattleSkillManager.newBuff = function(data)
{	
	var name = master_buff[data.buff_id.toString()].class_name
	if (BattleSkillManager.buffList[name])
	{
		var s = new BattleSkillManager.buffList[name](data);
		return s;
	}
	else
	{
		cc.log("BattleSkillManager.newBuff failed name = " + name);
	}
}

 /* 施法动画结束时调用
 * data.owner_id = 123;
 * data.skill_id = 456;
 * data.owner_index = 1;
 * data.owner_type = 1; 施法者是己方还是敌方
 * data.card = this;
*/
BattleSkillManager.cast = function(data)
{
	//BattleSkillManager._castSkill = new SkillBase(data);

	var buffArr = master_skill[data.skill_id.toString()].buff
	for (var i = 0; i < buffArr.length; i++) {
		var buffConf = buffArr[i];
		var buffFlag = BattleSkillManager.buffGenerate(buffConf.rate)
		if (buffFlag)
		{	
			var index = BattleSkillManager.getSkillTargetPos(data.owner_index, data.owner_type, buffConf.target_type);
			var affectBuffArr = BattleSkillManager.getBuffEffectScop(index, buffConf.attack_scope)
			for (var i = 0; i < affectBuffArr.length; i++) {
				var cardData = BattleSkillManager.getCardByIndex(affectBuffArr[i], data.owner_type, buffConf.target_type);
				if (cardData)
				{	
					var attack = BattleManager.getCardAttack(data.owner_index, data.owner_type);
					var isNeedBuff = BattleSkillManager.needAddBuff(cardData, buffConf.buff_id, attack);
					if (isNeedBuff)
					{	
						var buffData = {}
						buffData.conf = buffConf;
						buffData.source_index = data.owner_index;
						buffData.source_type = data.owner_type;
						buffData.source_attack = attack;
						buffData.begin_round = BattleManager.getRound();

						var buff = BattleSkillManager.newBuff(buffData);
						if (!cardData.buff)
						{
							cardData.buff = {};
						}
						cardData.buff[buffConf.buff_id] = buff;
					}	
				}
			}
		}
	}
}

/* 卡牌施法前逻辑，判断可否施法
 * return 1:释放技能 2：普攻
 */
BattleSkillManager.needCast = function(data)
{
	return 1;
}

//普攻
BattleSkillManager.normalAttack = function(data)
{
	var s = new BattleSkillManager.buffList["NormalAttack"](data);
}

/* 卡牌施法结束
 * 开始技能结算，技能伤害，技能目标，技能特效
 * data.source_id 施法卡牌id
 * data.skill_id  施法技能id
 * data.dest_id   中技能的卡牌id，array
 * data.dest_type 中技能为敌方还是我方
*/
BattleSkillManager.castFinish = function(data, flag)
{
	if (2 == flag)
	{
		BattleSkillManager.normalAttack(data);
	}
	else
	{
		var name = master_skill[skillId.toString()].class_name;
		var s = new BattleSkillManager.buffList[name](data);
	}
}

//获得被攻击武将的索引
//正常情况下是攻击对格武将，如果对方有嘲讽 则攻击嘲讽武将
//index:施法武将索引， sourceType施法武将阵营， targetType:该buff影响己方还是敌方
BattleSkillManager.getSkillTargetPos = function(index, sourceType, targetType)
{

}

//获取当前buff会影响的所有卡牌
//返回array 存储的是卡牌的index
BattleSkillManager.getBuffEffectScop = function(index)
{

}

//获取卡牌的信息 返回的是BattleManager._cardFightingEnemy 或者BattleManager._cardFightingMe
//index:中buff的武将索引， sourceType施法武将阵营，targetType:该buff影响己方还是敌方
BattleSkillManager.getCardByIndex = function(index, sourceType, targetType)
{
	return BattleManager._cardFightingEnemy or BattleManager._cardFightingMe
}

//如果该卡牌身上还没有buff，直接添加，如果已经有了 则需要判断已有buff和当前buff是否冲突
//若冲突，则
BattleSkillManager.needAddBuff = function(cardData, buff_id, attack)
{
	if (!cardData.buff)
	{
		return true;
	}

	for (var i in card.buff) {
		if (Number(i) == Number(buff_id))
		{
			if (Number(attack) > Number(card.buff[i].getSourceAttack()))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	
	return true;
}

//物理还是法术攻击
BattleSkillManager.getAttackType = function(skillId)
{
	return master_skill[skillId].attack_type;
}

BattleSkillManager.isMagicAttack = function(skillId)
{
	return BattleSkillManager.getAttackType(skillId) == BattleSkillManager.ATTACK_TYPE.MAGIC;
}

BattleSkillManager.isPhysicalAttack = function(skillId)
{
	return BattleSkillManager.getAttackType(skillId) == BattleSkillManager.ATTACK_TYPE.PHY;
}

/* 每一张卡牌出手之前，先将其所有技能存储起来
 * 每使用一个技能就剔除一个
 * 当本卡牌出手完毕的时候，清空
 * ATTENTION: 法术技能顺序执行，物理技能都合并成一个执行
*/
BattleSkillManager.initCardSkill = function()
{
	//数据结构
	data.card_index = 1;//卡牌位置索引
	data.card_type = BattleManager.FIGHTING_SIDE.ENEMY; //己方敌方
	data.skillList = [123,456,789]
}

