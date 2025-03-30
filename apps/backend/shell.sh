#!/bin/bash

read -p "Enter the name: " name

pnpm nest g mo api/v1/${name}

# pnpm nest g s api/v1/${name}/internal/${name}.internal --flat
# pnpm nest g co api/v1/${name}/internal/${name}.internal --flat

pnpm nest g s api/v1/${name}/guest/${name}.guest --flat
pnpm nest g co api/v1/${name}/guest/${name}.guest --flat

#check token
# pnpm nest g s api/v1/${name}/authroized/${name}.authroized --flat
# pnpm nest g co api/v1/${name}/authroized/${name}.authroized --flat

# pnpm nest g s api/v1/${name}/restricted/${name}.restricted --flat
# pnpm nest g co api/v1/${name}/restricted/${name}.restricted --flat

echo "Generation complete for: ${name}"ode v