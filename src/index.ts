
import { type City, type Person, persons, cities } from "./data.ts"


function LEFT_JOIN<L extends Object, R extends Object>(
    table_left: Array<L>,
    table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<L & Partial<R>> {

    const joined_table = table_left.map(row_left => {

        const found_row_right: Partial<R> = table_right.find(row_right => condition(row_left, row_right)) ?? {}

        return { ...found_row_right, ...row_left }
    })

    return joined_table
}

function RIGHT_JOIN<
    L extends Object, R extends Object
>(
    table_left: Array<L>, table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<Partial<L> & R> {

    // const joined_table = table_left.map(row_left => {

    //     const found_row_right: Partial<R> = table_right.find(row_right => condition(row_left, row_right)) ?? {}

    //     return { ...found_row_right, ...row_left }
    // })

    // return joined_table
}



const left_joined_table = LEFT_JOIN(persons, cities, (person, city) => person.city_id == city.id)

console.log({ left_joined_table })
left_joined_table[0].location_name

