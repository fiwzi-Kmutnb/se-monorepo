@echo off
set /p name=Enter the name: 

pnpm nest g mo api/v1/%name% &&

@REM pnpm nest g s api/v1/%name%/internal/%name%.internal --flat &&
@REM pnpm nest g co api/v1/%name%/internal/%name%.internal --flat &&

pnpm nest g s api/v1/%name%/guest/%name%.guest --flat &&
pnpm nest g co api/v1/%name%/guest/%name%.guest --flat &&

pnpm nest g s api/v1/%name%/authorized/%name%.authorized --flat &&
pnpm nest g co api/v1/%name%/authorized/%name%.authorized --flat &&

pnpm nest g s api/v1/%name%/restricted/%name%.restricted --flat &&
pnpm nest g co api/v1/%name%/restricted/%name%.restricted --flat

echo Generation complete for: %name%
pause
