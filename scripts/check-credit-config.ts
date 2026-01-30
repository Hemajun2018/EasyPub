/**
 * 诊断脚本: 检查积分配置
 * 用于排查新用户注册时积分未发放的问题
 */

import { db } from '@/core/db';
import { config, credit, user } from '@/config/db/schema';
import { desc, eq } from 'drizzle-orm';

async function checkCreditConfig() {
  console.log('=== 积分配置诊断 ===\n');

  // 1. 检查数据库中的积分相关配置
  console.log('1. 检查数据库配置:');
  const configs = await db().select().from(config);


  const creditConfigs = configs.filter((c) =>
    c.name.includes('initial_credits')
  );

  if (creditConfigs.length === 0) {
    console.log('  ❌ 未找到任何积分配置!');
    console.log('  提示: 请在管理后台的 "设置 > 通用 > 积分" 中配置');
  } else {
    console.log('  找到以下积分配置:');
    creditConfigs.forEach((c) => {
      console.log(`    ${c.name}: ${c.value}`);
    });
  }

  // 2. 检查最近注册的用户
  console.log('\n2. 检查最近注册的用户:');
  const recentUsers = await db()
    .select()
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(5);

  console.log(`  找到 ${recentUsers.length} 个最近注册的用户:`);
  for (const u of recentUsers) {
    console.log(`\n  用户: ${u.email}`);
    console.log(`    注册时间: ${u.createdAt}`);

    // 查询该用户的积分记录
    const userCredits = await db()
      .select()
      .from(credit)
      .where(eq(credit.userId, u.id))
      .orderBy(desc(credit.createdAt));

    if (userCredits.length === 0) {
      console.log(`    ❌ 没有积分记录`);
    } else {
      console.log(`    ✅ 有 ${userCredits.length} 条积分记录:`);
      userCredits.forEach((c) => {
        console.log(
          `      - ${c.transactionType}: ${c.credits} 积分 (剩余: ${c.remainingCredits}, 状态: ${c.status})`
        );
        console.log(`        描述: ${c.description}`);
        console.log(`        时间: ${c.createdAt}`);
      });
    }
  }

  // 3. 检查环境变量
  console.log('\n3. 检查环境变量:');
  const envKeys = [
    'INITIAL_CREDITS_ENABLED',
    'INITIAL_CREDITS_AMOUNT',
    'INITIAL_CREDITS_VALID_DAYS',
    'initial_credits_enabled',
    'initial_credits_amount',
    'initial_credits_valid_days',
  ];

  envKeys.forEach((key) => {
    if (process.env[key]) {
      console.log(`  ${key}: ${process.env[key]}`);
    }
  });

  console.log('\n=== 诊断完成 ===');
  process.exit(0);
}

checkCreditConfig().catch((error) => {
  console.error('诊断脚本执行失败:', error);
  process.exit(1);
});
