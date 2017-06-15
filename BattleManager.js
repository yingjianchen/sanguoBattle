var BattleManager = {};
/*
 *|
 *|  初始化静态变量
 *|
 *v
*/

//每回合战斗中的状态
//每回合状态机循环2次，我方一次，敌方一次
BattleManager.FIGHTING_STATE = 
{
	INIT        : 0, //进入战场的时候可能做一些初始化的工作，回合开始后就只在DEPLOY以后做循环
	ROUND_BEGIN : 1,
	DEPLOY      : 2, //部署 hero施法和卡牌合击都在此阶段
	ADD_ANGER   : 3, //回怒
	DEBUFF      : 4, //结算持续性负面伤害
	FIGHTING    : 5, //进入战斗
	ROUND_END   : 6, // 回合结束标识
}

//当前行动双方枚举
BattleManager.FIGHTING_SIDE = 
{
	BEGIN     : 0,
	ME        : 1, 
	ENEMY     : 2,
	INVALID   : 3,
}

//当前回合哪一方正在行动
BattleManager._side = 0;

//每方出战卡牌最大数量
BattleManager.CARD_TOTAL_EACH_SIDE = 5;
//敌方卡牌和我方卡牌 key-value
BattleManager._cardEnemy = {};
BattleManager._cardMe = {};
//敌方英雄和我方英雄
BattleManager._heroEnemy = {};
BattleManager._heroMe = {};

/* 双方备战区的卡牌，key为所在pos的索引
 * card BattleCardLayer
 * data 卡牌实时数据
 * buff 卡牌身上的buff信息, object key为buff id
 	* buff[id].source_index
 	* buff[id].source_type
 	* buff[id].source_attack
 	* buff[id].begin_round
*/
BattleManager._cardPrepareEnemy = {};
BattleManager._cardPrepareMe = {};

//双方出战的卡牌，key为所在pos的索引
BattleManager._cardFightingEnemy = {};
BattleManager._cardFightingMe = {};

BattleManager._state = 0;
BattleManager._battleLayer = null;

BattleManager._round = 0;

BattleManager.addPrepareEnemy = function(id , data)
{
	if (id.toString().length > 0)
	{
		BattleManager._cardPrepareEnemy[id.toString()] = data;
	}
	else
	{
		cc.log(" BattleManager.addPrepareEnemy failed");
	}
}

BattleManager.addPrepareMe = function(id, data)
{
	if (id.toString().length > 0)
	{
		BattleManager._cardPrepareMe[id.toString()] = data;
	}
	else
	{
		cc.log(" BattleManager.addPrepareMe failed");
	}
}

BattleManager.addCardEnemy = function(id , data)
{
	if (id.toString().length > 0)
	{
		BattleManager._cardEnemy[id.toString()] = data;
	}
	else
	{
		cc.log(" BattleManager.addCardEnemy failed");
	}
}

BattleManager.addCardMe = function(id, data)
{
	if (id.toString().length > 0)
	{
		BattleManager._cardMe[id.toString()] = data;
	}
	else
	{
		cc.log(" BattleManager.addCardMe failed");
	}
}

BattleManager.addHeroEnemy = function(data)
{
	BattleManager._heroEnemy = data;
}

BattleManager.addHeroMe = function(data)
{
	BattleManager.heroMe = data;
}

// card 存储的是BattleCardLayer
// data 存储的事card的数据
BattleManager.addFightingEnemy = function(index , card, data)
{	
	BattleManager._cardFightingEnemy[index] = BattleManager._cardFightingEnemy[index] || {};
	BattleManager._cardFightingEnemy[index].card = card;
	BattleManager._cardFightingEnemy[index].data = data;
}

BattleManager.addFightingMe = function(index, card)
{
	BattleManager._cardFightingMe[index] = BattleManager._cardFightingMe[index] || {};
	BattleManager._cardFightingMe[index].card = card;
	BattleManager._cardFightingMe[index].data = data;
}

//出战卡牌死亡时移除
BattleManager.removeFightingEnemy = function(index)
{
	if (BattleManager._cardFightingEnemy[index])
	{
		BattleManager._cardFightingEnemy[index].isKilled()
		BattleManager._cardFightingEnemy[index] = null;
	}
	else
	{
		cc.log(" BattleManager.removeFightingEnemy failed");
	}
}

BattleManager.removeFightingMe = function(index)
{
	if (BattleManager._cardFightingMe[index])
	{
		BattleManager._cardFightingMe[index].isKilled()
		BattleManager._cardFightingMe[index] = null;
	}
	else
	{
		cc.log(" BattleManager.removeFightingMe failed");
	}
}

BattleManager.setBattleLayer = function(layer)
{
	BattleManager._battleLayer = layer;
}

BattleManager.changeState = function()
{
	BattleManager._state += 1;
	if (BattleManager._state >= BattleManager.FIGHTING_STATE.END)
	{
		BattleManager._state = BattleManager.FIGHTING_STATE.DEPLOY;
	}

	BattleManager.update();
}

BattleManager.update = function()
{
	switch(BattleManager._state)
	{
		case BattleManager.FIGHTING_STATE.INIT:
			BattleManager.initBattle();
			break;
		case BattleManager.FIGHTING_STATE.ROUND_BEGIN:
			BattleManager.roundBegin();
			break;
		case BattleManager.FIGHTING_STATE.DEPLOY:
			BattleManager.deploy();
			break;
		case BattleManager.FIGHTING_STATE.ADD_ANGER:
			BattleManager.addAnger();
			break;
		case BattleManager.FIGHTING_STATE.DEBUFF:
			BattleManager.debuff();
			break;
		case BattleManager.FIGHTING_STATE.FIGHTING:
			BattleManager.fighting();
			break;
		case BattleManager.FIGHTING_STATE.ROUND_END:
			BattleManager.roundEnd();
			break;
	}
}

BattleManager.initBattle = function()
{
	BattleManager._battleLayer.initBattle();
}

BattleManager.initBattleFinish = function()
{
	BattleManager.changeState();
}

BattleManager.deploy = function()
{
	BattleManager._battleLayer.deploy();
}

BattleManager.deployFinish = function()
{
	BattleManager.changeState();
}

BattleManager.addAnger = function()
{
	BattleManager._battleLayer.addAnger();	
}

BattleManager.addAngerFinish = function()
{
	BattleManager.changeState();
}

BattleManager.debuff = function()
{
	BattleManager._battleLayer.debuff();
}

BattleManager.debuffFinish = function()
{
	BattleManager.changeState();
}

//开始战斗，做一些初始化工作 真正的卡牌轮流出手是在
//allCardFighting
BattleManager.fighting = function()
{
	BattleManager._side += 1;
	if (BattleManager._side < BattleManager.FIGHTING_SIDE.INVALID)
	{
		BattleManager._battleLayer.fighting();
	}
	else
	{	
		BattleManager._side = BattleManager.FIGHTING_SIDE.BEGIN;
		BattleManager.fightingFinish();
	}
}

BattleManager.fightingSideChange = function()
{
	
}

BattleManager.fightingFinish = function()
{
	BattleManager.changeState();
}

BattleManager.roundBegin = function()
{
	BattleManager._round += 1;
}

BattleManager.roundBeginFinish = function()
{
	BattleManager.changeState();
}

BattleManager.roundEnd = function()
{

}

BattleManager.roundEndFinish = function()
{
	BattleManager.changeState();
}

BattleManager.allCardFighting = function()
{
	var temp = BattleManager._cardFightingMe;
	if (BattleManager._side == BattleManager.FIGHTING_SIDE.ENEMY)
	{
		temp = BattleManager._cardFightingEnemy;
	}

	for (var i = 0; i < BattleManager.CARD_TOTAL_EACH_SIDE; i++)
	{
		temp[i].beginFighting();
	}
}

BattleManager.getRound = function()
{
	return BattleManager._round;
}


