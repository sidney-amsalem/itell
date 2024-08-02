export const Elements = {
	SITE_NAV: "site-nav",
	SITE_FOOTER: "site-footer",
	TEXTBOOK_NAV: "textbook-nav",
	PAGE_NAV: "page-nav",
	PAGE_PAGER: "page-pager",
	TEXTBOOK_MAIN: "textbook-main",
	TEXTBOOK_MAIN_WRAPPER: "textbook-main-wrapper",
	DASHBOARD_MAIN: "dashboard-main",
	PAGE_CONTENT: "page-content",
	PAGE_ASSIGNMENTS: "page-assignments",
	SUMMARY_FORM: "summary-form",
	SUMMARY_INPUT: "summary-input",
	STAIRS_HIGHLIGHTED_CHUNK: "stairs-highlighted-chunk",
	STAIRS_CONTAINER: "stairs-container",
	STAIRS_ANSWER_LINK: "stairs-answer-link",
	STAIRS_READY_BUTTON: "stairs-ready-button",
	STAIRS_RETURN_BUTTON: "stairs-return-button",
} as const;

export const lightColors = [
	"#FFEB99",
	"#99CCFF",
	"#99FF99",
	"#FF99CC",
	"#FFCC99",
	"#CC99FF",
	"#FFD966",
	"#66B2FF",
	"#66FF66",
	"#FF66B2",
	"#FFA366",
	"#A366FF",
	"#FFE066",
	"#66FFFF",
	"#66FFB2",
	"#FF66A3",
] as const;

export const darkColors = [
	"#FFD700",
	"#FF4500",
	"#32CD32",
	"#1E90FF",
	"#FF69B4",
	"#8A2BE2",
	"#FFA500",
	"#00CED1",
	"#ADFF2F",
	"#FF6347",
	"#BA55D3",
	"#40E0D0",
	"#FFDAB9",
	"#98FB98",
	"#FFB6C1",
	"#87CEFA",
] as const;

export const DefaultPreferences = {
	note_color_light: "#FFEB99",
	note_color_dark: "#BA55D3",
	theme: "light",
};
