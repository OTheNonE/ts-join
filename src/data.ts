
export type Person = {
    id: number,
    name: string,
    age: number,
    city_id: number,
}

export type City = {
    id: number,
    location_name: string,
    continent: string,
}

export const persons: Array<Person> = [
    {
        id: 1,
        name: "Charles",
        age: 5,
        city_id: 1,
    },
    {
        id: 2,
        name: "Henry",
        age: 10,
        city_id: 2,
    },
    {
        id: 3,
        name: "Peter",
        age: 15,
        city_id: 3,
    },
    {
        id: 4,
        name: "Lucas",
        age: 20,
        city_id: 2,
    },
]

export const cities: Array<City> = [
    {
        id: 1,
        location_name: "Copenhagen",
        continent: "Europe",
    },
    {
        id: 2,
        location_name: "New York",
        continent: "America"
    },
    {
        id: 3,
        location_name: "India",
        continent: "Asia"
    },
    {
        id: 4,
        location_name: "Nigeria",
        continent: "Afrika"
    },
]