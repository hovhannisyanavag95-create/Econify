export type Role = 'user' | 'model';

export interface Source {
    uri: string;
    title: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  sources?: Source[];
}

export interface User {
    fullName: string;
    email: string;
}

export type ChatMode = 'standard' | 'fast' | 'deep' | 'search' | 'image';

export type Theme = 'light' | 'dark';

export type Page = 'home' | 'chat' | 'pricing' | 'login' | 'signup' | 'dataviz' | 'api' | 'docs' | 'contact' | 'about' | 'blog' | 'careers' | 'privacy' | 'terms' | 'profile' | 'history';

// Chart Types
export type BarChartData = {
    label: string;
    value: number;
    color: string;
};

export type LineChartData = {
    x: number;
    y: number;
};

export type PieChartData = {
    label: string;
    value: number;
    color: string;
};

export type ScatterPlotData = {
    x: number;
    y: number;
    size: number;
    label: string;
};

export interface AllChartData {
    barData: BarChartData[];
    lineData: LineChartData[];
    pieData: PieChartData[];
    scatterData: ScatterPlotData[];
}