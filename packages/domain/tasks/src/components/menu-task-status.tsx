import type { task_statusType as TaskStatus } from "@shared/electric-sql";

import { Button, Menu, Popover, Tooltip } from "boondoggle";

import { useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { IconTaskStatus } from "../components/icon-task-status";
import { getStatusString } from "../lib/strings";

const STATUS_ITEMS: { id: TaskStatus; label: string }[] = [
	{
		id: "to_do",
		label: i18n.status_to_do,
	},
	{
		id: "in_progress",
		label: i18n.status_in_progress,
	},
	{
		id: "completed",
		label: i18n.status_completed,
	},
];

/**
 * A menu that is rendered on each table row, and allows quickly changing the task's status.
 */
export function MenuTaskStatus({ id, status }: { id: string; status: TaskStatus }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const updateStatus = async (id: string, s: TaskStatus) => {
		await db.tasks.update({
			data: { status: s, updated_at: new Date(Date.now()) },
			where: { id },
		});
	};

	return (
		<Menu.Trigger>
			<Tooltip.Root delay={1000}>
				<Button appearance="ghost" data-testid={`menu_status_${status}`} size="sm" square>
					<IconTaskStatus status={status} />
				</Button>
				<Tooltip.Body placement="bottom">{getStatusString(status)}</Tooltip.Body>
			</Tooltip.Root>
			<Popover.Root placement="right top">
				<Menu.DropdownMenu disabledKeys={[status]} selectedKeys={[status]}>
					<Menu.Section>
						{STATUS_ITEMS.map((t) => {
							return (
								<Menu.Item
									icon={<IconTaskStatus status={t.id} />}
									id={t.id}
									key={t.id}
									onAction={() => {
										void updateStatus(id, t.id);
									}}
								>
									{t.label}
								</Menu.Item>
							);
						})}
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover.Root>
		</Menu.Trigger>
	);
}
