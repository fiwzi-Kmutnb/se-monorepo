@echo off
set /p name=Enter the name: 

call pnpm nest g mo api/v1/%name%

@REM call pnpm nest g s api/v1/%name%/internal/%name%.internal --flat
@REM call pnpm nest g co api/v1/%name%/internal/%name%.internal --flat

call pnpm nest g s api/v1/%name%/guest/%name%.guest --flat
call pnpm nest g co api/v1/%name%/guest/%name%.guest --flat

call pnpm nest g s api/v1/%name%/authorized/%name%.authorized --flat
call pnpm nest g co api/v1/%name%/authorized/%name%.authorized --flat

call pnpm nest g s api/v1/%name%/restricted/%name%.restricted --flat
call pnpm nest g co api/v1/%name%/restricted/%name%.restricted --flat

echo Generation complete for: %name%
pause
