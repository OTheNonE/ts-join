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

const comparators = {
    eq: (a: any, b: any) => {
        return a == b
    },
    and: (...statements: Array<any>) => {
        return statements.every(statement => statement)
    }
}

type Comparators = typeof comparators

function PLAYGROUND<L extends Object, R extends Object>(
    table_left: Array<L>,
    table_right: Array<R>,
    condition: (columns: [L, R], comparators: Comparators) => boolean
) {

    const first_row_left = table_left.at(0)
    const first_row_right = table_right.at(0)

    if (!first_row_left || !first_row_right) return

    const first_row_left_properties_accessed: Array<string | symbol> = []
    const first_row_right_properties_accessed: Array<string | symbol> = []

    function createProxy<T extends Object>(param: T, log: Array<string | symbol>): T {
        return new Proxy(param, {
            get(target, prop, receiver) {
                log.push(prop)
                return Reflect.get(target, prop, receiver)
            }
        })
    }

    const comparators = {
        eq: (a: any, b: any) => {
            return a == b
        },
        and: (...statements: Array<any>) => {
            return statements.every(statement => statement)
        }
    }

    const first_row_left_proxy = createProxy(first_row_left, first_row_left_properties_accessed)
    const first_row_right_proxy = createProxy(first_row_right, first_row_right_properties_accessed)

    const result = condition([first_row_left_proxy, first_row_right_proxy], comparators)

    return { result, first_row_left_properties_accessed, first_row_right_properties_accessed }
}


console.log(PLAYGROUND(
    persons, 
    cities, 
    ([person, city], { eq, and }) => and(eq(person.city_id, city.id), eq(person.city_id, city.id))
))