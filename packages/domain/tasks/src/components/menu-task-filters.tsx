import type { PreselectedDatetimeRange } from "@shared/date";
import type { task_statusType } from "@shared/electric-sql";

import { faFilterList } from "@fortawesome/pro-solid-svg-icons/faFilterList";
import { Button, Icon, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";
import { useDispatch, useSelector } from "react-redux";

import { clear_filters, date_range_last_7_days, date_range_last_90_days, date_range_last_day, date_range_last_hour, date_range_next_7_days, date_range_next_90_days, date_range_next_day, date_range_next_hour, due_date, filter_by_due_date, filter_by_status, filter_tasks, overdue, status, status_completed, status_in_progress, status_to_do, upcoming } from "@shared/i18n";
import {
	clearFilterDueDate,
	clearFilterTaskStatus,
	filterByDueDate,
	filterByStatus,
	selectDueDateFilter,
	selectStatusFilterList,
} from "@shared/redux";

const STATUS_MENU_ITEMS: { id: task_statusType; label: string }[] = [
	{ id: "to_do", label: status_to_do },
	{ id: "in_progress", label: status_in_progress },
	{ id: "completed", label: status_completed },
];

export function MenuTaskFilterStatus() {
	const activeFilters = useSelector(selectStatusFilterList);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			aria-label={filter_by_status}
			selectedKeys={activeFilters}
			selectionMode="multiple"
		>
			<Menu.Section>
				{STATUS_MENU_ITEMS.map(({ id, label }) => {return (
					<Menu.Item id={id} key={id} onAction={() => {return dispatch(filterByStatus(id))}}>
						{label}
					</Menu.Item>
				)})}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					hideCheckbox
					id="clear_filters"
					isDisabled={activeFilters.length === 0}
					onAction={() => {
						dispatch(clearFilterTaskStatus());
					}}
				>
					{clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

const DUE_DATE_PAST_ITEMS: { id: PreselectedDatetimeRange; label: string }[] = [
	{ id: "last_hour", label: date_range_last_hour },
	{ id: "last_day", label: date_range_last_day },
	{ id: "last_7_days", label: date_range_last_7_days },
	{ id: "last_90_days", label: date_range_last_90_days },
];

const DUE_DATE_FUTURE_ITEMS: { id: PreselectedDatetimeRange; label: string }[] = [
	{ id: "next_hour", label: date_range_next_hour },
	{ id: "next_day", label: date_range_next_day },
	{ id: "next_7_days", label: date_range_next_7_days },
	{ id: "next_90_days", label: date_range_next_90_days },
];

export function MenuTaskFilterDueDate() {
	const activeFilter = useSelector(selectDueDateFilter);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			aria-label={filter_by_due_date}
			selectedKeys={activeFilter ? [activeFilter] : undefined}
			selectionMode="single"
		>
			<Menu.Section>
				<Menu.SectionHeader>{overdue}</Menu.SectionHeader>
				{DUE_DATE_PAST_ITEMS.map(({ id, label }) => {return (
					<Menu.Item id={id} key={id} onAction={() => {return dispatch(filterByDueDate(id))}}>
						{label}
					</Menu.Item>
				)})}
			</Menu.Section>
			<Menu.Section>
				<Menu.SectionHeader>{upcoming}</Menu.SectionHeader>
				{DUE_DATE_FUTURE_ITEMS.map(({ id, label }) => {return (
					<Menu.Item id={id} key={id} onAction={() => {return dispatch(filterByDueDate(id))}}>
						{label}
					</Menu.Item>
				)})}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					hideCheckbox
					id="clear_filters"
					isDisabled={!activeFilter}
					onAction={() => {
						dispatch(clearFilterDueDate());
					}}
				>
					{clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

export function MenuTaskFilters() {
	return (
		<Menu.Trigger>
			<TooltipTrigger delay={1000}>
				<Button appearance="ghost" square>
					<Icon color="grey" icon={faFilterList} />
				</Button>
				<Tooltip placement="bottom">{filter_tasks}</Tooltip>
			</TooltipTrigger>
			<Popover placement="right top">
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.SubMenuTrigger>
							<Menu.Item>{status}</Menu.Item>
							<Popover placement="right top">
								<MenuTaskFilterStatus />
							</Popover>
						</Menu.SubMenuTrigger>

						<Menu.SubMenuTrigger>
							<Menu.Item>{due_date}</Menu.Item>
							<Popover placement="right top">
								<MenuTaskFilterDueDate />
							</Popover>
						</Menu.SubMenuTrigger>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
