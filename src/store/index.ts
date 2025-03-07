// src/store/index.ts
import { atom, selector, DefaultValue } from "recoil";

export const counterState = atom({
	key: "counterState",
	default: 0,
});

export interface AuthState {
	isLoggedIn: boolean;
	phoneNumber: string | null;
}

const initialAuthState: AuthState = {
	isLoggedIn: false,
	phoneNumber: null,
};

export const authState = atom<AuthState>({
	key: "authState",
	default: initialAuthState,
});

export const loginSelector = selector({
	key: "loginSelector",
	get: ({ get }) => get(authState),
	set: ({ set }, newValue) => {
		if (!(newValue instanceof DefaultValue)) {
			const newAuthState = newValue as AuthState;
			set(authState, newAuthState);
			localStorage.setItem("auth", JSON.stringify(newAuthState)); // Save to localStorage
			localStorage.setItem(
				"phoneNumber",
				newAuthState.phoneNumber || ""
			);
		}
	},
});

export const logoutSelector = selector({
	key: "logoutSelector",
	get: ({ get }) => get(authState),
	set: ({ set }) => {
		set(authState, initialAuthState);
	},
});

export const timerState = atom<number>({
	key: "timerState",
	default: 0,
});

export const startTimerSelector = selector({
	key: "startTimerSelector",
	get: ({ get }) => get(timerState),
	set: ({ set }) => {
		const newTimer = 7200; // 2 hours
		const timestamp = Date.now();
		set(timerState, newTimer);
		localStorage.setItem("timer", newTimer.toString());
		localStorage.setItem("timestamp", timestamp.toString());
		console.log(
			"Timer started:",
			newTimer,
			"Timestamp:",
			timestamp
		);
	},
});

export const extendTimerSelector = selector({
	key: "extendTimerSelector",
	get: ({ get }) => get(timerState),
	set: ({ set, get }) => {
		const currentTimer = get(timerState);
		const newTimer = currentTimer + 300; // Extend by another 5 minutes
		const timestamp = Date.now();
		set(timerState, newTimer);
		localStorage.setItem("timer", newTimer.toString());
		localStorage.setItem("timestamp", timestamp.toString());
		console.log(
			"Timer extended:",
			newTimer,
			"Timestamp:",
			timestamp
		);
	},
});

export const updateTimerSelector = selector({
	key: "updateTimerSelector",
	get: ({ get }) => get(timerState),
	set: ({ set }) => {
		const storedTimer = localStorage.getItem("timer");
		const storedTimestamp = localStorage.getItem("timestamp");

		if (storedTimer && storedTimestamp) {
			const elapsedTime = Math.floor(
				(Date.now() - parseInt(storedTimestamp, 10)) / 1000
			);
			const remainingTime =
				parseInt(storedTimer, 10) - elapsedTime;

			if (remainingTime > 0) {
				set(timerState, remainingTime);
			} else {
				set(authState, initialAuthState); // Log out if the remaining time is zero or less
				console.log("Timer expired, logging out");
			}
		}
	},
});

// New Atom for Remaining Time Until 3 PM
export const timeUntil3pmState = atom<number>({
  key: "timeUntil3pmState",
  default: calculateTimeUntil3pm(),
});

export function calculateTimeUntil3pm(): number {
  const now = new Date();
  const target = new Date();
  target.setHours(15, 0, 0, 0); // Set target time to 15:00:00 (3 PM)

  if (now > target) {
    target.setDate(target.getDate() + 1); // If now is past 3 PM, set target to 3 PM tomorrow
  }

  const diff = target.getTime() - now.getTime();
  return Math.floor(diff / 1000); // Return difference in seconds
}

export const updateTimeUntil3pmSelector = selector({
  key: "updateTimeUntil3pmSelector",
  get: ({ get }) => get(timeUntil3pmState),
  set: ({ set }) => {
    set(timeUntil3pmState, calculateTimeUntil3pm());
  },
});