interface IUser {
    _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
    address: string;
    gender: string;
    birthDate: string;
    verified?: boolean;
    languages: Array<string>;
    imageUrl: string;
    admin: boolean;
}

interface Sensor {
    name: string;
    type: string;
}

interface Cell {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    static: boolean;
}

interface AvatarDropDown {
    title?: string;
    link?: string;
    divider?: boolean;
}

interface LanguageOptions {
    title: string;
    flag: string;
}

interface NavigationItems {
    title?: string;
    icon?: string;
    link?: string;
    header?: boolean;
    text?: string;
}

export { IUser, Sensor, Cell, AvatarDropDown, LanguageOptions, NavigationItems };
