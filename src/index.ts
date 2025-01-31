import { persons, cities } from "./data.ts"

function LEFT_JOIN<L extends Object, R extends Object>(
    table_left: Array<L>,
    table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<L & Partial<R>> {

    return table_left.map(row_left => {

        const found_row_right: Partial<R> = table_right.find(row_right => condition(row_left, row_right)) ?? {}

        return { ...found_row_right, ...row_left }
    })
}

function RIGHT_JOIN<L extends Object, R extends Object>(
    table_left: Array<L>, 
    table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<Partial<L> & R> {

    return table_right.map(row_right => {

        const found_row_left: Partial<L> = table_left.find(row_left => condition(row_left, row_right)) ?? {}

        return { ...row_right, ...found_row_left }
    })
}

function INNER_JOIN<L extends Object, R extends Object>(
    table_left: Array<L>, 
    table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<L & R> {

    return table_left.map(row_left => {

        const found_row_right = table_right.find(row_right => condition(row_left, row_right))

        if (!found_row_right) return undefined

        return { ...found_row_right, ...row_left }
    }).filter(row => typeof row !== "undefined")
}

function OUTER_JOIN<L extends Object, R extends Object>(
    table_left: Array<L>,
    table_right: Array<R>,
    condition: (row_left: L, row_right: R) => boolean
): Array<Partial<L> & Partial<R>> {
    
    const result: Array<Partial<L> & Partial<R>> = [];
    const matchedRight = new Set<R>();

    const not_found_row_right: Partial<R> = {}
    const not_found_row_left: Partial<L> = {}
    

    table_left.forEach(row_left => {
        const found_row_right = table_right.find(row_right => condition(row_left, row_right));
        if (found_row_right) {
            matchedRight.add(found_row_right);
            result.push({ ...row_left, ...found_row_right });
        } else {
            result.push({ ...row_left, ...not_found_row_right });
        }
    });

    table_right.forEach(row_right => {
        if (!matchedRight.has(row_right)) {
            result.push({ ...not_found_row_left, ...row_right });
        }
    });

    return result;
}

const left_joined_table = LEFT_JOIN(
    persons, 
    cities, 
    (person, city) => person.city_id == city.id
)

const right_joined_table = RIGHT_JOIN(
    persons, 
    cities, 
    (person, city) => person.city_id == city.id
)

console.log({ left_joined_table, right_joined_table })

