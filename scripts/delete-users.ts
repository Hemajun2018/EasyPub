/**
 * 删除指定用户脚本
 */

import { db } from '@/core/db';
import { user } from '@/config/db/schema';
import { eq, or } from 'drizzle-orm';

async function deleteUsers() {
  console.log('=== 删除用户 ===\n');

  const emailsToDelete = [
    '1825932860@qq.com',
    'shuishoujihua@outlook.com',
  ];

  console.log('准备删除以下用户:');
  emailsToDelete.forEach((email) => console.log(`  - ${email}`));
  console.log('');

  try {
    // 查询要删除的用户
    const usersToDelete = await db()
      .select()
      .from(user)
      .where(
        or(
          eq(user.email, emailsToDelete[0]),
          eq(user.email, emailsToDelete[1])
        )
      );

    if (usersToDelete.length === 0) {
      console.log('❌ 未找到要删除的用户');
      process.exit(0);
    }

    console.log(`找到 ${usersToDelete.length} 个用户:`);
    usersToDelete.forEach((u) => {
      console.log(`  - ${u.email} (ID: ${u.id}, 注册时间: ${u.createdAt})`);
    });
    console.log('');

    // 删除用户 (由于设置了 onDelete: 'cascade', 相关的积分、会话等记录会自动删除)
    const result = await db()
      .delete(user)
      .where(
        or(
          eq(user.email, emailsToDelete[0]),
          eq(user.email, emailsToDelete[1])
        )
      )
      .returning();

    console.log(`✅ 成功删除 ${result.length} 个用户:`);
    result.forEach((u) => {
      console.log(`  - ${u.email}`);
    });
    console.log('\n提示: 由于数据库设置了级联删除,相关的积分、会话、订单等记录也已自动删除。');
  } catch (error) {
    console.error('❌ 删除用户失败:', error);
    process.exit(1);
  }

  console.log('\n=== 删除完成 ===');
  process.exit(0);
}

deleteUsers();
